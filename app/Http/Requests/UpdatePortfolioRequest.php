<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePortfolioRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'project_url' => ['nullable', 'url'],
            'image' => ['nullable', 'image', 'max:5120'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'max:5120'],
            'development_time' => ['nullable', 'string', 'max:255'],
            'tools' => ['nullable', 'array'],
            'tools.*' => ['string'],
            'github_url' => ['nullable', 'url'],
            'video_url' => ['nullable', 'string'],
        ];
    }
}
