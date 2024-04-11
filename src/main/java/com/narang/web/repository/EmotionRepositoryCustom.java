package com.narang.web.repository;

import com.narang.web.entity.Emotion;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EmotionRepositoryCustom {
    public List<Emotion> findByUid(String uid);

    public Emotion findByDid(String did);
    public List<Emotion> findByDate(String uid, LocalDateTime start, LocalDateTime end);

    public Boolean deleteByDid(String did);

    public Boolean deleteByUid(String uid);
}
