import React, { createContext, useReducer } from "react";
import {
  deleteCommentById,
  insertComment,
  updateCommentById,
} from "../apis/comment";
import Comment from "../models/Comment";

const LOAD_COMMENT = "comment/load";
const SET_COMMENT = "comment/set";
const UPDATE_COMMENT = "comment/update";
const REMOVE_COMMENT = "comment/remove";

type Type =
  | typeof LOAD_COMMENT
  | typeof SET_COMMENT
  | typeof UPDATE_COMMENT
  | typeof REMOVE_COMMENT;
interface Action {
  type: Type;
  comments?: any[];
  comment?: any;
  id?: string;
}

const initialValues: any[] = [];

export const CommentContext = createContext([]);

export const loadComment = (comments: any[]) => ({
  type: LOAD_COMMENT,
  comments: comments,
});

export const setComment = (comment: any) => ({
  type: SET_COMMENT,
  comment: comment,
});

export const updateComment = (comment: any) => ({
  type: UPDATE_COMMENT,
  comment: comment,
});

export const removeComment = (id: string) => ({
  type: REMOVE_COMMENT,
  id: id,
});

const reducer = (state: any[], action: Action) => {
  const comment = new Comment();
  let formData;
  switch (action.type) {
    case LOAD_COMMENT:
      return action.comments;
    case SET_COMMENT:
      comment.getResponseData(action.comment);
      formData = comment.makeFormData();
      insertComment(formData);
      comment.set("regdate", new Date());
      return state.concat(comment);
    case UPDATE_COMMENT:
      comment.getResponseData(action.comment);
      formData = comment.makeFormData();
      formData.append("id", action.comment.id);
      updateCommentById(formData);
      return state.map((c) => {
        if (c.id === action.comment.id) {
          Object.entries(action.comment).forEach(([k, v]) => {
            c[k] = v !== null ? v : c[k];
          });
        }
        return c;
      });
    case REMOVE_COMMENT:
      deleteCommentById(action.id);
      return state.filter((c) => c.id !== action.id);
  }
};

function CommentProvider({ children }: { children: React.ReactElement }) {
  const [state, dispatch] = useReducer(reducer, initialValues);

  return (
    <CommentContext.Provider value={[state, dispatch]}>
      {children}
    </CommentContext.Provider>
  );
}

export default CommentProvider;
