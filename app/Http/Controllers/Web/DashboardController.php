<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class DashboardController extends Controller
{
    /**
     * Redirect to the default view (Today).
     */
    public function index(): RedirectResponse
    {
        return redirect()->route('today');
    }
}
