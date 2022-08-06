import { Box, TextField, Button, Stack, FormHelperText } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import Analyzer from "../../tools/analyzer";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import { insertDiary } from "../../apis/diary";
import Emotions from "../../models/Emotions";
import "suneditor/dist/css/suneditor.min.css";
import Diary from "../../models/Diary";
import SwitchLabels from "../../components/molecules/SwitchLabels";
import { insertEmotions } from "../../apis/emotions";
import { useCookies } from "react-cookie";
import { checkToken } from "../../apis/auth";
import { UserContext } from "../../contexts/UserProvider";

interface FormikProps {
  title: string;
  content: string;
  author: string;
  isShare: boolean;
  uid: string;
  did: string;
}

function WriteForm() {
  const navigate = useNavigate();
  const [user, dispatch] = useContext(UserContext);
  const [cookies, setCookie] = useCookies(["token"]);
  const editor = useRef<SunEditorCore>();
  const [formData, setFormData] = useState({ title: "" });

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      author: "",
      isShare: false,
      uid: "",
      did: "",
    },
    validationSchema: yup.object({
      title: yup.string().required("필수 항목 입니다."),
      content: yup.string(),
      author: yup.string(),
      isShare: yup.boolean(),
      uid: yup.string(),
      did: yup.string(),
    }),
    onSubmit: async (values) => {
      formik.values.author = user.nickName;
      // values로 넣는 이유는 form data에 전달되는 반응 속도가 제일 빨라서.
      formik.values.content = editor.current?.getContents(true);
      formik.values.uid = user.id;

      const emotionResult = await sendDiaryInfo();

      const diary = new Diary();
      diary.getResponseData(values as unknown as Diary);

      const diaryFormData = diary.makeFormData();

      const diaryId = await insertDiary(diaryFormData);

      const emotion = new Emotions();
      emotion.getResponseData(
        emotionResult.emotionScore as unknown as Emotions,
      );
      emotion.set("uid", values.uid);
      emotion.set("did", diaryId);

      const emotionFormData = emotion.makeFormData();
      console.log(emotion);
      insertEmotions(emotionFormData);

      navigate("/diary");
    },
  });

  useEffect(() => {
    if (!cookies.token) {
      navigate("/diary");
    } else {
      checkToken(cookies.token).then((res) => {
        if (res.result === false) {
          navigate("/diary");
        }
      });
    }
  }, []);

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const sendDiaryInfo = async () => {
    const analyzer = new Analyzer(
      "ko",
      "en",
      editor.current?.getContents(true),
    );

    await analyzer.translate();
    const result = analyzer.analyze();
    return {
      regdate: Date.now(),
      negative: result.negative,
      positive: result.positive,
      score: result.score,
      emotionScore: analyzer.getEmotionScore(),
    };
  };

  return (
    <Box>
      <Box
        component='form'
        sx={{
          "& .MuiTextField-root": { m: 1, width: "50ch" },
        }}
        noValidate
        autoComplete='off'
        onSubmit={formik.handleSubmit}>
        <Stack direction='row' alignItems='center' sx={{ gap: 3 }}>
          <Box component='span' mb={2}>
            <TextField
              label='제목을 입력하세요'
              id='standard-size-normal'
              variant='standard'
              onChange={formik.handleChange}
              value={formik.values.title}
              name='title'
              color={formik.errors.title ? "error" : "info"}
            />
            {formik.touched.title && (
              <FormHelperText
                error={formik.touched.title}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "100%",
                  whiteSpace: "nowrap",
                }}>
                {formik.errors.title}
              </FormHelperText>
            )}
          </Box>
          <Box component='span'>
            <SwitchLabels name='isShare' formik={formik} />
          </Box>
        </Stack>
        <Box>
          <SunEditor
            lang='ko'
            // defaultValue='<p>내용을 입력하세요</p>'
            placeholder='내용을 입력하세요'
            width='100%'
            height='300px'
            name='content'
            getSunEditorInstance={getSunEditorInstance}
          />
        </Box>
        <Stack
          direction='row'
          spacing={4}
          mt={2}
          justifyContent='center'
          alignItems='center'>
          <Button
            variant='contained'
            size='medium'
            color='primary'
            type='submit'>
            일기 저장하기
          </Button>
          <Button variant='contained' size='medium' color='warning'>
            취소
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default WriteForm;
