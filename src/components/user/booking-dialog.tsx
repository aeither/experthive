import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import BookingForm from "./booking-form";

const BookingDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-500 text-white" variant={"outline"}>
          Book a call
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a call</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <BookingForm />
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
