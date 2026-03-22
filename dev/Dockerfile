ARG UBUNTU_VERSION="24.04"

FROM ubuntu:${UBUNTU_VERSION}

LABEL maintainer="Dario Vogogna<stein.dario@gmail.com>"

ARG UBUNTU_VERSION
ARG PHP_VERSION="8.5"
ARG NODE_VERSION="24"
ARG POSTGRES_VERSION="18"

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=UTC \
    WORKDIR="/app" \
    DEV_USER="developer" \
    DEV_GID="1000" \
    DEV_UID="1000" \
    UBUNTU_VERSION=${UBUNTU_VERSION} \
    PHP_VERSION=${PHP_VERSION} \
    PHP_INI_DIR="/etc/php/${PHP_VERSION}/cli/conf.d/" \
    NODE_VERSION=${NODE_VERSION} \
    PLAYWRIGHT_BROWSERS_PATH=0

SHELL ["/bin/bash", "-l", "-c"]
WORKDIR ${WORKDIR}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone; \
    echo "Acquire::http::Pipeline-Depth 0;" > /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99custom; \
    apt-get update \
    && apt-get upgrade -y \
    && mkdir -p /etc/apt/keyrings \
    && apt-get install -y \
        curl \
        ca-certificates \
        zip unzip \
        git \
        supervisor \
        gosu \
        gnupg \
        dnsutils \
        vim \
    && apt-get -y autoremove && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install PHP from ondrej/php PPA
RUN curl -sS 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xb8dc7e53946656efbce4c1dd71daeaab4ad4cab6' | gpg --dearmor | tee /etc/apt/keyrings/ppa_ondrej_php.gpg > /dev/null \
    && echo "deb [signed-by=/etc/apt/keyrings/ppa_ondrej_php.gpg] https://ppa.launchpadcontent.net/ondrej/php/ubuntu noble main" > /etc/apt/sources.list.d/ppa_ondrej_php.list \
    && apt-get update \
    && apt-get install -y \
      php${PHP_VERSION}-cli \
      php${PHP_VERSION}-dev \
      php${PHP_VERSION}-pgsql \
      php${PHP_VERSION}-sqlite3 \
      php${PHP_VERSION}-gd \
      php${PHP_VERSION}-curl \
      php${PHP_VERSION}-mbstring \
      php${PHP_VERSION}-xml \
      php${PHP_VERSION}-zip \
      php${PHP_VERSION}-bcmath \
      php${PHP_VERSION}-intl \
      php${PHP_VERSION}-readline \
      php${PHP_VERSION}-msgpack \
      php${PHP_VERSION}-igbinary \
      php${PHP_VERSION}-redis \
      php${PHP_VERSION}-pcov \
      php${PHP_VERSION}-xdebug \
      php${PHP_VERSION}-excimer \
    && apt-get -y autoremove && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install composer
RUN curl -sLS "https://getcomposer.org/installer" | php -- --install-dir=/usr/bin/ --filename=composer

# Install NodeJS and PNPM
RUN curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get -y autoremove && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && npm install -g npm \
    && npm install -g pnpm \
    && npx playwright install-deps

# Install PostgreSQL client
RUN curl -sS https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | tee /etc/apt/keyrings/pgdg.gpg >/dev/null \
    && echo "deb [signed-by=/etc/apt/keyrings/pgdg.gpg] http://apt.postgresql.org/pub/repos/apt noble-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update \
    && apt-get install -y postgresql-client-$POSTGRES_VERSION \
    && apt-get -y autoremove && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN setcap "cap_net_bind_service=+ep" "/usr/bin/php${PHP_VERSION}"

RUN userdel -r ubuntu \
    && groupadd --force -g ${DEV_GID} ${DEV_USER} \
    && useradd -ms /bin/bash --no-user-group -g ${DEV_GID} -u ${DEV_UID} ${DEV_USER} \
    && git config --global --add safe.directory /app

ENV XDG_CONFIG_HOME="/home/${DEV_USER}/.config" \
    XDG_DATA_HOME="/home/${DEV_USER}/.local/share"

COPY supervisord.conf "/etc/supervisor/conf.d/supervisord.conf"
COPY php.ini "/etc/php/${PHP_VERSION}/cli/conf.d/99-app.ini"
COPY start-container "/usr/local/bin/start-container"
RUN chmod +x "/usr/local/bin/start-container"

ENTRYPOINT ["start-container"]

HEALTHCHECK --start-period=60s \
            --start-interval=2s \
            --interval=2s \
            --timeout=1s \
            --retries=8 \
            CMD ps -ef | grep artisan | grep -v grep || exit 1
