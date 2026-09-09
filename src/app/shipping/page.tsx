export const metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="micro text-muted">Dates, not surprises</p>
      <h1 className="display mt-3 text-6xl">When it actually ships.</h1>
      <p className="mt-6 text-sm text-muted">
        Yeezy-style stores bury weeks of wait. We put the window on the product,
        estimate it from your ZIP, and repeat it here.
      </p>
      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink">
            <th className="py-2">Origin</th>
            <th>Window</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-line">
            <td className="py-3">US studio stock</td>
            <td>2–6 business days</td>
          </tr>
          <tr className="border-b border-line">
            <td className="py-3">Mill / made to order</td>
            <td>10–21 business days — shown on the garment</td>
          </tr>
          <tr className="border-b border-line">
            <td className="py-3">Preorder drops</td>
            <td>4–6 weeks, emailed when it leaves</td>
          </tr>
          <tr className="border-b border-line">
            <td className="py-3">Returns</td>
            <td>30 days, prepaid label</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
