import {
    Card,
    CardContent, CardHeader,
    Typography
} from "@mui/material";
import { Meeting } from "../../services/dasMeetingService";

import { EntityProps } from "../../components/utils";

import { CARD_HEADER_SX } from "./utils";

export function NextMeetingCard({ entity: meeting }: EntityProps<Meeting>) {
    return (meeting &&
        <Card >
            <CardHeader
                sx={{ backgroundColor: CARD_HEADER_SX }}
                title={'Next Meeting'} />
            <CardContent>
                <Typography>Next Meeting widget goes here</Typography>
            </CardContent>
        </Card>)
}

