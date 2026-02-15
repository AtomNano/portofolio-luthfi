<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderPortfolioImagesRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'images' => ['required', 'array'],
            'images.*.id' => ['required', 'integer', 'exists:portfolio_images,id'],
            'images.*.order' => ['required', 'integer', 'min:0'],
        ];
    }
}
