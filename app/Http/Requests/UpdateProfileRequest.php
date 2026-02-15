<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $this->user()->id],
            'job_title' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'bio' => ['nullable', 'string'],

            // JSON validation
            'skills' => ['nullable', 'array'],
            'skills.*.name' => ['required', 'string'],
            'skills.*.level' => ['required', 'integer', 'min:0', 'max:100'],
            'skills.*.category' => ['required', 'string'], // Backend, Frontend, DevOps

            'soft_skills' => ['nullable', 'array'],
            'soft_skills.*.name' => ['required', 'string'],

            'social_links' => ['nullable', 'array'],
            'social_links.*.platform' => ['required', 'string'],
            'social_links.*.url' => ['required', 'url'],
            'social_links.*.icon' => ['nullable', 'string'], // Could be strict about icon names if needed
        ];
    }
}
