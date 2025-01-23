
const Quote = () => {
  return (
      <div className="hidden h-screen w-1/2 bg-slate-300 p-14 md:flex flex-col justify-center items-center">
        <div>
          <p className="text-3xl">
            "The customer service i recieved was unbelievable. The team went
            above and beyond to address my concerns."
          </p>
        </div>
        <div className="w-full mt-5">
          <p className="font-bold text-3xl">Jules Winnfield</p>
          <p className="text-slate-600">CEO, Acme Inc</p>
        </div>
      </div>
  );
};

export default Quote;
