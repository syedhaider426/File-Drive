import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { Snackbar, CircularProgress } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "black",
    color: "white",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions({
  accordionOpen,
  uploadFiles,
  accordionMsg,
  filesStatus,
}) {
  const [expanded, setExpanded] = React.useState("panel");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={accordionOpen}
      >
        <Accordion
          square
          expanded={expanded === "panel"}
          onChange={handleChange("panel")}
        >
          <AccordionSummary aria-controls="panel-content" id="panel1-header">
            <Typography
              style={{
                display: "flex",
                width: "40vw",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                alignItems: "center",
              }}
            >
              {accordionMsg}
              {!filesStatus ? <CircularProgress /> : <CheckCircleOutlineIcon />}
            </Typography>
          </AccordionSummary>
          {uploadFiles?.map((file) => (
            <AccordionDetails>
              <Typography>{file}</Typography>
            </AccordionDetails>
          ))}
        </Accordion>
      </Snackbar>
    </div>
  );
}
