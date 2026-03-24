# Multi-stage Dockerfile for a Laravel application using FrankenPHP and Octane
ARG PLATFORM="linux/amd64"

ARG APP_NAME="akyrey/donezo"
ARG APP_VERSION="0.0.1"
ARG APP_VERSION_HASH="__git_hash__"

# FrankenPHP and Caddy versions are highly codependent,
# check FrankenPHP releases to find out the compatible Caddy versions
# https://github.com/php/frankenphp/releases
# https://hub.docker.com/_/caddy
ARG FRANKEN_VERSION="1.11.3"
ARG CADDY_VERSION="2.11.1"

ARG PHP_VERSION="8.5"
ARG COMPOSER_VERSION="latest"
ARG NODE_VERSION="lts-alpine"
ARG WORKDIR="/app"

## Composer stage ##############################################################
FROM composer:${COMPOSER_VERSION} AS vendor
FROM caddy:${CADDY_VERSION}-builder AS builder

## Node stage for assets building stage ########################################
FROM node:${NODE_VERSION} AS assets

ARG WORKDIR

ENV WORKDIR="$WORKDIR"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR ${WORKDIR}
COPY --link package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --link . .
RUN pnpm run build:ssr

## Caddy builder stage #########################################################
FROM dunglas/frankenphp:${FRANKEN_VERSION}-builder-php${PHP_VERSION}-alpine AS caddy

COPY --from=builder /usr/bin/xcaddy /usr/bin/xcaddy

RUN --mount=type=cache,id=gomod,target=/go/pkg/mod \
    --mount=type=cache,id=gobuild,target=/root/.cache/go-build \
    CGO_ENABLED=1 \
    XCADDY_SETCAP=1 \
    XCADDY_GO_BUILD_FLAGS="-ldflags='-w -s' -tags=nobadger,nomysql,nopgx" \
    CGO_CFLAGS=$(php-config --includes) \
    CGO_LDFLAGS="$(php-config --ldflags) $(php-config --libs)" \
    xcaddy build \
        --output /usr/local/bin/frankenphp \
        --with github.com/dunglas/frankenphp=./ \
        --with github.com/dunglas/frankenphp/caddy=./caddy/ \
        --with github.com/dunglas/caddy-cbrotli

## FrankenPHP builder stage ####################################################
FROM dunglas/frankenphp:${FRANKEN_VERSION}-php${PHP_VERSION}-alpine AS franken

COPY --from=caddy /usr/local/bin/frankenphp /usr/local/bin/frankenphp

LABEL maintainer="Akyrey <stein.dario@gmail.com>"
LABEL org.opencontainers.image.title="Donezo docker image"
LABEL org.opencontainers.image.source="https://github.com/exaco/laravel-octane-dockerfile"
LABEL org.opencontainers.image.licenses="MIT"

ARG WWWUSER=1000
ARG WWWGROUP=1000
ARG USERNAME=octane
ARG WORKDIR

# PYTHONWARNINGS is set to ignore deprecation warnings for supervisor
ENV TERM=xterm-color \
    OCTANE_SERVER=frankenphp \
    USER="${USERNAME}" \
    WORKDIR="${WORKDIR}" \
    LOG_LEVEL=info \
    LOG_CHANNEL=json \
    COMPOSER_FUND=0 \
    COMPOSER_MAX_PARALLEL_HTTP=24 \
    XDG_CONFIG_HOME="/home/${USERNAME}/.config" \
    XDG_DATA_HOME="/home/${USERNAME}/.data" \
    WITH_HORIZON=false \
    WITH_SCHEDULER=false \
    WITH_REVERB=true \
    WITH_INERTIA_SSR=true \
    PYTHONWARNINGS="ignore:pkg_resources is deprecated"

WORKDIR ${WORKDIR}

SHELL ["/bin/sh", "-eou", "pipefail", "-c"]

RUN ln -snf /usr/share/zoneinfo/UTC /etc/localtime \
    && echo UTC > /etc/timezone

# System layer setup
RUN apk update; \
    apk upgrade --no-cache; \
    apk add --no-cache \
        curl \
        tzdata \
        ca-certificates \
        supervisor \
        libsodium-dev \
        jq \
    && rm -rf /var/cache/apk/* /tmp/* /var/tmp/*

# Install PHP extensions (included with dunglas/frankenphp)... \
RUN install-php-extensions \
        apcu \
        bz2 \
        pcntl \
        mbstring \
        bcmath \
        sockets \
        opcache \
        exif \
        pdo_pgsql \
        zip \
        intl \
        redis \
        igbinary \
        excimer \
        uv \
    && docker-php-source delete \
    && rm -rf /tmp/* /var/tmp/*

# Install Supercronic for cron jobs management
RUN arch="$(apk --print-arch)" \
    && case "$arch" in \
         armhf) _cronic_fname='supercronic-linux-arm' ;; \
         aarch64) _cronic_fname='supercronic-linux-arm64' ;; \
         x86_64) _cronic_fname='supercronic-linux-amd64' ;; \
         x86) _cronic_fname='supercronic-linux-386' ;; \
         *) echo >&2 "error: unsupported architecture: $arch"; exit 1 ;; \
       esac \
    && curl "https://github.com/aptible/supercronic/releases/download/v0.2.34/${_cronic_fname}" -o /usr/bin/supercronic \
    && chmod +x /usr/bin/supercronic \
    && mkdir -p /etc/supercronic \
    && echo "*/1 * * * * php ${WORKDIR}/artisan schedule:run --no-interaction" > /etc/supercronic/laravel

# Create application user
RUN addgroup -g ${WWWGROUP} ${USER} \
    && adduser -D -G ${USER} -u ${WWWUSER} -s /bin/sh ${USER} \
    && setcap -r /usr/local/bin/frankenphp

# Create basic directories and set permissions
RUN mkdir -p /var/log/supervisor /var/run/supervisor \
    && chown -R ${USER}:${USER} ${WORKDIR} /var/log /var/run \
    && chmod -R a+rw ${WORKDIR} /var/log /var/run

RUN cp ${PHP_INI_DIR}/php.ini-production ${PHP_INI_DIR}/php.ini

USER ${USER}

# System binaries
COPY --link --chown=${WWWUSER}:${WWWUSER} --from=vendor /usr/bin/composer /usr/bin/composer
COPY --link --chown=${WWWUSER}:${WWWUSER} ./docker/deployment/log /usr/local/bin/log
COPY --link --chown=${WWWUSER}:${WWWUSER} ./docker/deployment/entrypoint /usr/local/bin/entrypoint
COPY --link --chown=${WWWUSER}:${WWWUSER} ./docker/deployment/healthcheck /usr/local/bin/healthcheck

RUN chmod +x /usr/bin/composer \
    /usr/local/bin/entrypoint \
    /usr/local/bin/healthcheck \
    /usr/local/bin/log

# FrankenPHP & Caddy configuration files
COPY --link --chown=${WWWUSER}:${WWWUSER} ./docker/deployment/Caddyfile /etc/
COPY --link --chown=${WWWUSER}:${WWWUSER} ./docker/deployment/supervisord.conf /etc/
COPY --link --chown=${WWWUSER}:${WWWUSER} ./docker/deployment/supervisord.*.conf /etc/supervisor/conf.d/
COPY --link --chown=${WWWUSER}:${WWWUSER} ./docker/deployment/php.ini ${PHP_INI_DIR}/conf.d/99-octane.ini

## Final image build (runner) ##################################################
FROM franken AS runner

ARG APP_NAME
ARG APP_VERSION
ARG APP_VERSION_HASH

LABEL org.opencontainers.image.title="${APP_NAME}" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.versionhash="${APP_VERSION_HASH}" \
      org.opencontainers.image.description="${APP_NAME} service" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.authors="Akyrey <stein.dario@gmail.com>" \
      org.opencontainers.image.maintainer="Akyrey <stein.dario@gmail.com>"

ENV APP_NAME="${APP_NAME}" \
    APP_VERSION="${APP_VERSION}" \
    APP_VERSION_HASH="${APP_VERSION_HASH}"

# Vendor files installation
COPY --link --chown=${WWWUSER}:${WWWUSER} composer.json composer.lock ./
# Cannot use --classmap-authoritative since some classes are loaded dynamically by Laravel
# See https://laravel.com/docs/10.x/deployment#optimization for more details
RUN --mount=type=cache,id=composer,target=/tmp/composer-cache \
     composer install \
        --no-ansi \
        --no-cache \
        --no-dev \
        --no-interaction \
        --no-progress \
        --no-scripts \
        --prefer-dist \
        --optimize-autoloader \
        --apcu-autoloader

# Application files
COPY --link --chown=${WWWUSER}:${WWWUSER} ./artisan artisan
COPY --link --chown=${WWWUSER}:${WWWUSER} ./.env.production .env
COPY --link --chown=${WWWUSER}:${WWWUSER} --from=assets ${WORKDIR}/public public
# Copy Inertia SSR requirements (Node binary and node_modules)
COPY --link --chown=${WWWUSER}:${WWWUSER} --from=assets /usr/local/bin/node /usr/local/bin/node
COPY --link --chown=${WWWUSER}:${WWWUSER} --from=assets ${WORKDIR}/node_modules node_modules

COPY --link --chown=${WWWUSER}:${WWWUSER} ./app app
COPY --link --chown=${WWWUSER}:${WWWUSER} ./bootstrap bootstrap
COPY --link --chown=${WWWUSER}:${WWWUSER} ./config config
COPY --link --chown=${WWWUSER}:${WWWUSER} ./database database
COPY --link --chown=${WWWUSER}:${WWWUSER} ./resources resources
COPY --link --chown=${WWWUSER}:${WWWUSER} ./routes routes
COPY --link --chown=${WWWUSER}:${WWWUSER} ./storage storage

RUN mkdir -p \
        bootstrap/cache \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/testing \
        storage/framework/views \
        storage/logs \
    && chmod -R a+rw storage

RUN APP_URL=http://localhost \
    BROADCAST_CONNECTION=log \
    REVERB_APP_KEY=placeholder \
    REVERB_APP_SECRET=placeholder \
    REVERB_APP_ID=placeholder \
    composer build \
    && composer clear-cache

EXPOSE 8080
EXPOSE 2019

ENTRYPOINT ["entrypoint"]

HEALTHCHECK --start-period=120s --start-interval=30s --interval=15s --timeout=5s --retries=8 CMD healthcheck || exit 1
