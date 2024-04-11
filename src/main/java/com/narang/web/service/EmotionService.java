package com.narang.web.service;

import com.narang.web.entity.Emotion;
import com.narang.web.repository.EmotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmotionService {
    private EmotionRepository emotionRepository;

    @Autowired
    EmotionService (EmotionRepository emotionRepository) {
        this.emotionRepository = emotionRepository;
    }

    public List<Emotion> findAll() {
        return emotionRepository.findAll();
    }

    public Emotion findById(String id) {
        return emotionRepository.findById(id).orElseThrow();
    }
    public List<Emotion> findByUid(String uid) {
        return emotionRepository.findByUid(uid);
    }
    public Emotion findByDid(String did) {
        return emotionRepository.findByDid(did);
    }
    public List<Emotion> findByDate(String uid, LocalDateTime start, LocalDateTime end) {
        return emotionRepository.findByDate(uid, start, end);
    }

    public String insert(Emotion emotion) {
        Emotion newEmotion = emotionRepository.insert(emotion);
        return newEmotion.getId();
    }

    public Boolean deleteById(String id){
        emotionRepository.deleteById(id);
        return true;
    }

    public Boolean deleteByDid(String did) {
        return emotionRepository.deleteByDid(did);
    }
    public Boolean deleteByUid(String uid) {
        return emotionRepository.deleteByUid(uid);
    }
}
