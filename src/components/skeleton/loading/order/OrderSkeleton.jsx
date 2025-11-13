import { Skeleton, SVGSkeleton } from "../../Skeleton";

const OrderSkeleton = () => {
  return (
    <>
      <Skeleton className="w-[5008px] max-w-full " />
      <div>
        <Skeleton className="w-[112px] max-w-full" />
      </div>
      <div>
        <h2>
          <Skeleton className="w-[208px] max-w-full" />
        </h2>
        <div>
          <div>
            <div>
              <div>
                <Skeleton className="w-[2480px] max-w-full" />
                <div>
                  <Skeleton className="w-[776px] max-w-full" />
                  <span>
                    <Skeleton className="w-[112px] max-w-full" />
                  </span>
                  <span>
                    <Skeleton className="w-[80px] max-w-full" />
                  </span>
                </div>
                <span>
                  <Skeleton className="w-[64px] max-w-full" />
                </span>
              </div>
              <span>
                <Skeleton className="w-[368px] max-w-full" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSkeleton;
