import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="pb-24">
      <ProductForm isEditing={false} />
    </div>
  );
}
