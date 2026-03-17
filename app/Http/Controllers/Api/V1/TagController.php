<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Data\TagData;
use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TagController extends Controller
{
    /**
     * List all tags for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $tags = $request->user()
            ->tags()
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => TagData::collect($tags),
        ]);
    }

    /**
     * Create a new tag.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'color' => ['sometimes', 'nullable', 'string', 'max:7'],
        ]);

        $tag = $request->user()->tags()->create($validated);

        return response()->json([
            'data' => TagData::from($tag),
        ], 201);
    }

    /**
     * Get a single tag.
     */
    public function show(Request $request, Tag $tag): JsonResponse
    {
        abort_unless($tag->user_id === $request->user()->id, 403);

        return response()->json([
            'data' => TagData::from($tag),
        ]);
    }

    /**
     * Update a tag.
     */
    public function update(Request $request, Tag $tag): JsonResponse
    {
        abort_unless($tag->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'color' => ['sometimes', 'nullable', 'string', 'max:7'],
        ]);

        $tag->update($validated);

        return response()->json([
            'data' => TagData::from($tag),
        ]);
    }

    /**
     * Delete a tag.
     */
    public function destroy(Request $request, Tag $tag): JsonResponse
    {
        abort_unless($tag->user_id === $request->user()->id, 403);

        $tag->tasks()->detach();
        $tag->delete();

        return response()->json(null, 204);
    }
}
