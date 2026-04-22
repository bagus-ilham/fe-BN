import { supabase } from "@/utils/supabase";

export type DashboardPeriod = "today" | "7d" | "30d";

function getPeriodStart(period: DashboardPeriod) {
  const now = new Date();
  const start = new Date(now);

  if (period === "today") {
    start.setHours(0, 0, 0, 0);
    return start;
  }

  const days = period === "7d" ? 7 : 30;
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return start;
}

export async function getDashboardStats(period: DashboardPeriod = "today") {
  // 1. Total Products
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);

  // 2. New Orders (Pending)
  const { count: pendingOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // 3. Sales by Period
  const periodStart = getPeriodStart(period);
  
  const { data: periodSales } = await supabase
    .from("orders")
    .select("total_amount")
    .eq("status", "paid")
    .gte("created_at", periodStart.toISOString());

  const totalSalesInPeriod = periodSales?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

  // 4. Low Stock
  const { count: lowStockCount } = await supabase
    .from("inventory")
    .select("*", { count: "exact", head: true })
    .lt("stock_quantity", 5);

  return {
    productCount: productCount || 0,
    pendingOrdersCount: pendingOrdersCount || 0,
    totalSalesInPeriod,
    lowStockCount: lowStockCount || 0,
    period,
  };
}

export async function getPublicBrandStats() {
  // 1. Total Customers (from profiles)
  const { count: customerCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // 2. Total Reviews (approved) & Average Rating
  const { data: reviewData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("status", "approved");

  const reviewCount = reviewData?.length || 0;
  const avgRating = reviewCount > 0 
    ? ((reviewData || []).reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviewCount).toFixed(1) 
    : "4.9";

  // 3. Items Sold (sum of units_sold from products)
  const { data: salesData } = await supabase
    .from("products")
    .select("units_sold");
  
  const totalItemsSold = salesData?.reduce((acc, curr) => acc + (curr.units_sold || 0), 0) || 0;

  return {
    customers: customerCount || 0,
    reviews: reviewCount || 0,
    avgRating: avgRating,
    itemsSold: totalItemsSold || 0,
  };
}
