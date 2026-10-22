import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function SubmitButton({ loading, loadingText, children, className, ...props }) {
  return (
    <Button type="submit" disabled={loading} className={cn('btn-gradient', className)} {...props}>
      {loading ? (
        <>
          <Spinner />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
