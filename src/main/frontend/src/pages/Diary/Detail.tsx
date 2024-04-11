import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findDiaryById } from "../../apis/diary";
import { findEmotionByDid, insertEmotions } from "../../apis/emotions";
import DetailLayout from "../../components/templates/DetailLayout";
import DetailLayoutSkeleton from "../../components/templates/DetailLayoutSkeleton";
import Emotions from "../../models/Emotions";
import Analyzer from "../../tools/analyzer";

function Detail() {
  const params = useParams();
  const [diary, setDiary] = useState(null);
  const [emotion, setEmotion] = useState(null);

  useEffect(() => {
    const getDiaryWithEmotion = async () => {
      const diaryId = params.id;
      const getDiary = await findDiaryById(diaryId);
      setDiary(getDiary);
      let getEmotion = await findEmotionByDid(diaryId);
      if (getEmotion) {
        setEmotion(getEmotion);
      } else {
        const emotionResult = await sendDiaryInfo(getDiary);

        const emotion = new Emotions();
        emotion.getResponseData(
          emotionResult.emotionScore as unknown as Emotions,
        );
        emotion.set("uid", getDiary.uid);
        emotion.set("did", diaryId); // diary수정 시 id가 아닌 객체를 받아옴

        const emotionFormData = emotion.makeFormData();
        await insertEmotions(emotionFormData);
        getEmotion = await findEmotionByDid(diaryId);

        if (getEmotion) {
          setEmotion(getEmotion);
        }
      }
    };
    getDiaryWithEmotion();
  }, [params.id]);

  const sendDiaryInfo = async (diary: any) => {
    const analyzer = new Analyzer(
      "ko",
      "en",
      new DOMParser().parseFromString(
        diary.content,
        "text/html",
      ).body.innerText,
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
    <Stack>
      <DetailLayoutSkeleton
        isLoaded={
          // false
          !!diary && !!emotion
        }>
        {diary && emotion && <DetailLayout diary={diary} emotion={emotion} />}
      </DetailLayoutSkeleton>
    </Stack>
  );
}

export default Detail;
