<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderPortfoliosRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'portfolios' => ['required', 'array'],
            'portfolios.*.id' => ['required', 'exists:portfolios,id'],
            'portfolios.*.order' => ['required', 'integer'],
        ];
    }
}
