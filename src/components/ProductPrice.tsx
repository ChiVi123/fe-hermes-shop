import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

type Props = {
  price: number;
  discountPrice: number;
  className?: string;
};

const productPriceVariant = cva('flex gap-2 [&_[data-name]]:text-lg [&_[data-name="discountPrice"]]:text-red-800', {
  variants: {
    discounted: {
      true: '[&_[data-name="price"]]:text-muted-foreground [&_[data-name="price"]]:line-through',
      false: '',
    },
  },
  defaultVariants: {
    discounted: false,
  },
});

export default function ProductPrice({
  price,
  discountPrice,
  className,
}: Props & VariantProps<typeof productPriceVariant>) {
  const isDiscount = discountPrice < price;

  return (
    <div className={cn(productPriceVariant({ discounted: isDiscount, className }))}>
      {isDiscount && <span data-name='discountPrice'>${discountPrice}</span>}
      <span data-name='price'>${price}</span>
    </div>
  );
}
