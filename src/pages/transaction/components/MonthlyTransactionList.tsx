import { useQuery } from "@apollo/client";
import { Box, Card, CardBody, Text } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import * as numeral from "numeral";
import { GET_TRANSACTIONS } from "./DailyTransactionList";
import * as dayjs from "dayjs";
import React from "react";
import { DatesSetArg } from "@fullcalendar/core/index.js";

export const MonthlyTransactionList = () => {
  const [dates, setDates] = React.useState({
    fromDate: dayjs(new Date()).startOf("month").format("YYYY-MM-DD"),
    toDate: dayjs(new Date()).endOf("month").format("YYYY-MM-DD"),
  });

  const { data = { transactions: [] } } = useQuery(GET_TRANSACTIONS, {
    variables: {
      createdById: 1,
      ...dates,
    },
  });

  const events = data.transactions
    .map((t) => {
      return [
        {
          date: t.date,
          title: `${t.income}`,
          textColor: "white",
          borderColor: "#38a169",
          backgroundColor: "#38a169",
        },
        {
          date: t.date,
          title: `${t.expense}`,
          textColor: "white",
          borderColor: "#E53E3E",
          backgroundColor: "#E53E3E",
        },
        {
          date: t.date,
          title: `${t.income - t.expense}`,
          textColor: "white",
          borderColor: "gray",
          backgroundColor: "gray",
        },
      ];
    })
    .flat();

  const handleDatesSet = (e: DatesSetArg) => {
    setDates({ fromDate: e.startStr, toDate: e.endStr });
  };

  return (
    <Card size="sm">
      <CardBody>
        <FullCalendar
          firstDay={0}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventOrder="date"
          eventContent={(evenInfo) => {
            return (
              <Text color={evenInfo.event.textColor}>
                {numeral(evenInfo.event.title).format("0,0")}đ
              </Text>
            );
          }}
          datesSet={handleDatesSet}
          dayCellContent={(e) => {
            return <Box>{e.dayNumberText}</Box>;
          }}
          headerToolbar={{
            right: "prev,next",
          }}
          aspectRatio={1}
        />
      </CardBody>
    </Card>
  );
};
