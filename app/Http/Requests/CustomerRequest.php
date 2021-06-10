<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules = [
            'nama' => ['required'],
            'contact' => ['required', 'numeric', 'digits_between:10,13'],
            'email' => ['required', 'email'],
            'alamat' => ['required'],
            'diskon' => ['nullable', 'required_with:tipe_diskon', 'numeric'],
            'tipe_diskon' => ['required_with:diskon'],
            'ktp' => ['required', 'mimes:png,jpg']
        ];

        if (request()->isMethod('patch')) {
            $rules['ktp'] = ['nullable', 'mimes:png,jpg'];
        }
        return $rules;
    }
}
