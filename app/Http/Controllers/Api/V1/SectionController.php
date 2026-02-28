<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * List all sections for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $sections = $request->user()
            ->sections()
            ->orderBy('position')
            ->with(['projects' => fn ($q) => $q->orderBy('position')])
            ->get();

        return response()->json([
            'data' => $sections,
        ]);
    }

    /**
     * Create a new section.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $maxPosition = $request->user()->sections()->max('position') ?? 0;

        $section = $request->user()->sections()->create([
            'name' => $validated['name'],
            'position' => $maxPosition + 1,
        ]);

        return response()->json([
            'data' => $section,
        ], 201);
    }

    /**
     * Get a single section.
     */
    public function show(Request $request, Section $section): JsonResponse
    {
        abort_unless($section->user_id === $request->user()->id, 403);

        $section->load(['projects' => fn ($q) => $q->orderBy('position')]);

        return response()->json([
            'data' => $section,
        ]);
    }

    /**
     * Update a section.
     */
    public function update(Request $request, Section $section): JsonResponse
    {
        abort_unless($section->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        $section->update($validated);

        return response()->json([
            'data' => $section,
        ]);
    }

    /**
     * Soft delete a section.
     */
    public function destroy(Request $request, Section $section): JsonResponse
    {
        abort_unless($section->user_id === $request->user()->id, 403);

        $section->delete();

        return response()->json(null, 204);
    }
}
