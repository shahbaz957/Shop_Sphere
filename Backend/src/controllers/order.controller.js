import { Order } from "../models/order.model";
import { Product } from "../models/product.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const orderProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?._id;
  const { quantity } = req.body;

  if (!productId) {
    throw new ApiError(422, "ProductId is required");
  }
  if (!userId) {
    throw new ApiError(401, "Unauthorized Access");
  }

  if (quantity <= 0) {
    throw new ApiError(422, "Quantity Must be Atleast One");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }
  if (product.stock < quantity) {
    throw new ApiError(400, "Not Enough Stock Available");
  }

  product.stock -= quantity;
  await product.save();
  const order = await Order.create({
    userId,
    productId,
    quantity,
    UnitPrice: product.price,
  });

  if (!order) {
    throw new ApiError(501, "Error Occured while creating the order on Server");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order is created !!!"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "Unauthorized Access. Failed to Access");
  }
  const orders = await Order.find({ status: "Pending" }).populate("productId");
  if (!orders) {
    throw new ApiError(500, "Server Failed to Fetch the Orders");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders are fetched successfully"));
});

const getOrdersByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized to Perform Action");
  }

  const pendingOrders = await Order.find({
    userId,
    status: "Pending",
  }).populate("productId");
  const deliveredOrders = await Order.find({
    userId,
    status: "Delivered",
  }).populate("productId");
  if (!pendingOrders || !deliveredOrders) {
    throw new ApiError(500, "Server failed to fetch the orders");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { pending: pendingOrders, delivered: deliveredOrders },
        "Orders are fetched for the user"
      )
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(422, "ProductId is needed");
  }
  if (!userId) {
    throw new ApiError(401, "Unauthorized Action");
  }
  const deletedOrder = await Order.deleteOne({ userId, productId });
  if (deletedOrder.deletedCount === 0) {
    throw new ApiError(404, "Order to be deleted not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deletedOrder, "Order is Deleted Successfully"));
});

const totalEarningAndSales = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "unAuthorized Action");
  }
  const totalSales = await Order.countDocuments({ status: "Delivered" });

  const totalEarningAggregate = await Order.aggregate([
    { $match: { status: "Delivered" } },
    {
      $group: {
        _id: null, // group all the elements in single group
        earnings: {
          $sum: {
            $multiply: ["$quantity", "$UnitPrice"],
          },
        },
      },
    },
  ]);
  const totalEarning = totalEarningAggregate[0]?.earnings || 0;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { sales: totalSales, earning: totalEarning },
        "Sales and Earning are fetched"
      )
    );
});

const toggleOrder =  asyncHandler(async (req , res) => {
    if (!req.user.isAdmin){
        throw new ApiError(401 , "Unauthorized Access");
    }
    const {productId} = req.params;
    if (!productId) {
        throw new ApiError(422 , "Product Id is required")
    }
    const order = await Order.findOne({productId});
    if (!order){
        throw new ApiError(404 , "Product Not Found")
    }
    order.status = "Delivered";
    await order.save();

    return res
    .status(200)
    .json(new ApiResponse(200 , order, "Status is toggled"))


})
export {    
  orderProduct,
  getAllOrders,
  getOrdersByUser,
  deleteOrder,
  totalEarningAndSales,
  toggleOrder
};
