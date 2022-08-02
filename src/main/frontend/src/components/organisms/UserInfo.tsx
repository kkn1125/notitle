import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import { convertLongToDate } from "../../tools/utils";

interface UserInfoProps {
  author: string;
  regdate: number;
  slot?: React.ReactElement | React.ReactElement[];
}

function UserInfo({ author, regdate, slot }: UserInfoProps) {
  const getFirstWord = (name: string) => {
    return name[0].toUpperCase();
  };

  return (
    <Stack direction='row' alignItems='center' sx={{ gap: 2, mb: 3 }}>
      <Avatar children={getFirstWord(author)} sx={{ width: 48, height: 48 }} />
      <Stack justifyContent='space-between'>
        <Typography>{author}</Typography>
        <Stack direction='row' alignItems='center'>
          <Typography
            variant='body2'
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}>
            {convertLongToDate(regdate)}
          </Typography>
          {slot}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default UserInfo;
