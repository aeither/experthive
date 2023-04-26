import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  title: string;
  description: string;
  date: string;
};

const BookingForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log(data);
    setIsSubmitted(true);
  };

  return (
    <>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-lg">
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: true })}
              className={`w-full rounded-md border px-4 py-2 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">Title is required</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block font-medium">
              Description
            </label>
            <textarea
              id="description"
              {...register("description", { required: true })}
              className={`w-full rounded-md border px-4 py-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                Description is required
              </p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block font-medium">
              Date
            </label>
            <input
              type="date"
              id="date"
              {...register("date", { required: true })}
              className={`w-full rounded-md border px-4 py-2 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">Date is required</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Book now
          </button>
        </form>
      ) : (
        <BookingSuccess />
      )}
    </>
  );
};

const BookingSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src="/success.png" alt="Success" className="mb-4 h-32 w-32" />
      <p className="mb-4 text-lg font-medium text-gray-800">
        Your booking has been confirmed!
      </p>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Book again
      </button>
    </div>
  );
};

export default BookingForm;
