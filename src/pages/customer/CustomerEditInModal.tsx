import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CustomerEditInModalCustomerView from "./CustomerEditInModalCustomerView";

export default function CustomerEditInModal(props) {
  const handleClose = () => {
    props.onClose();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Müşteri Güncelle</DialogTitle>
        <DialogContent dividers={true}>
          <CustomerEditInModalCustomerView
            customer={props.customer}
            handleClose={handleClose}
          ></CustomerEditInModalCustomerView>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
