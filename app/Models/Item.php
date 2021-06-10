<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['nama_item', 'unit', 'stok', 'harga_satuan', 'barang'];

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
}
