<?php

namespace App\Http\Controllers;

use App\Http\Requests\SalesRequest;
use App\Http\Resources\DataCollection;
use App\Models\Item;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = Sale::with(['customer', 'saleItems'])->orderBy(request()->order_column, (request()->order_direction == 'true' ? 'DESC' : 'ASC'));
        if (request()->keyword != '') {
            $data = $data->where('code_transaksi', 'LIKE', '%' . request()->keyword . '%');
        }
        return new DataCollection($data->paginate(request()->per_page));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\SalesRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SalesRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                $data = $request->only((new Sale)->getFillable());
                $sale = Sale::create($data);

                $sale->saleItems()->createMany($request->sale_items);
                foreach ($request->sale_items as $item) {
                    Item::where('id', $item['item_id'])->decrement('stok', $item['qty']);
                }
            });

            return response()->json(['status' => 'success'], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => $th->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function show(Sale $sale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Sale $sale)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function destroy(Sale $sale)
    {
        //
    }
}
