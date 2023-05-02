import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import PortfolioForm from "./portfolio-form";

const PortfolioDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Upload</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <PortfolioForm />
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioDialog;
