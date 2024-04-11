import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { findCommentAll } from "../../apis/comment";
import { CommentContext, loadComment } from "../../contexts/CommentProvider";
import { UserContext } from "../../contexts/UserProvider";
import AvatarBox from "./AvatarBox";

const menuId = "primary-search-account-menu";

function MessageBox() {
  const navigate = useNavigate();
  const [comments, commentDispatch] = useContext(CommentContext);
  const [user, dispatch] = useContext(UserContext);
  const [cookies, setCookie] = useCookies(["token"]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mentionInfo, setMentionInfo] = useState([]);

  useEffect(() => {
    if (cookies.token) {
      findCommentAll().then((result) => {
        commentDispatch(loadComment(result));
      });
    }
  }, []);

  useEffect(() => {
    comments.forEach(
      (comment: {
        id: string;
        mention: string;
        author: string;
        content: string;
        did: string;
      }) => {
        if (comment.mention.indexOf(user.nickName) > -1) {
          setMentionInfo(
            mentionInfo.concat({
              id: comment.id,
              from: comment.author,
              content: comment.content,
              diaryId: comment.did,
            }),
          );
          console.log(mentionInfo);
        }
      },
    );
  }, [comments]);

  const handleOpenMentionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMentionMenu = () => {
    setAnchorEl(null);
  };

  const getUserNickName = (content: string) =>
    content.match(/@[\w\_\-\.]+/g)
      ? `[ ${content
          .match(/@[\w\_\-\.]+/g)
          .map((_) => _.replace("@", ""))
          .join(", ")} ]`
      : "";
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}>
      {cookies.token && (
        <>
          <IconButton
            size='large'
            aria-label='show 17 new notifications'
            color='inherit'
            onClick={handleOpenMentionMenu}>
            <Badge badgeContent={mentionInfo.length} color='error'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {mentionInfo.length > 0 && (
            <Menu
              sx={{ mt: "45px" }}
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseMentionMenu}>
              {mentionInfo.map(({ id, from, content, diaryId }) => (
                <MenuItem
                  key={id}
                  onClick={() => {
                    handleCloseMentionMenu();
                    navigate(`/diary/${diaryId}`);
                  }}
                  title={location.origin + `/diary/${diaryId}`}>
                  <Typography textAlign='center'>
                    {getUserNickName(content)} was mentioned by "
                    {from === user.nickName ? "me" : from}"
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          )}
        </>
      )}
      <AvatarBox />
    </Box>
  );
}

export default MessageBox;
