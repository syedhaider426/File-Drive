import moment from "moment";

export default function convertISODate(d) {
  let date = moment(d);
  date = date.utc().format("MMMM Do YYYY, h:mm:ss a");
  return date;
}
