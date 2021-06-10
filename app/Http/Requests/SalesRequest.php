<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalesRequest extends FormRequest
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
        return [
            'code_transaksi' => ["required", 'unique:sales,code_transaksi'],
            'tanggal_transaksi' => ["required"],
            'customer_id' => ["required"],
            'total_diskon' => ["required", 'numeric'],
            'total_harga' => ["required", 'numeric'],
            'total_bayar' => ["required", 'numeric', 'min:' . request()->total_harga],
            'sale_items' => ['required'],
            'sale_items.*.item_id' => ['required'],
            'sale_items.*.qty' => ['required', 'numeric', 'min:1'],
        ];
    }

    public function attributes()
    {
        return [
            'customer_id' => 'customer',
            'sale_items.*.item_id' => 'item',
            'sale_items.*.qty' => 'qty',
        ];
    }
}
