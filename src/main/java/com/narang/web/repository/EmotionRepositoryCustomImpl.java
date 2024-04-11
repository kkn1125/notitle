package com.narang.web.repository;

import com.narang.web.entity.Emotion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class EmotionRepositoryCustomImpl implements EmotionRepositoryCustom {
    private MongoTemplate emotionTemplate;

    @Autowired
    EmotionRepositoryCustomImpl(MongoTemplate emotionTemplate) {
        this.emotionTemplate = emotionTemplate;
    }

    @Override
    public List<Emotion> findByUid(String uid) {
        Criteria cr = new Criteria("uid").is(uid);
        Query q = new Query(cr);
        List<Emotion> foundEmotion = emotionTemplate.find(q, Emotion.class);
        return foundEmotion;
    }

    @Override
    public Emotion findByDid(String did) {
        Criteria cr = new Criteria("did").is(did);
        Query q = new Query(cr);
        Emotion foundEmotion = emotionTemplate.findOne(q, Emotion.class);
        return foundEmotion;
    }

    @Override
    public List<Emotion> findByDate(String uid, LocalDateTime start, LocalDateTime end) {
        // 요건 금방 복사한거
//        q.addCriteria(Criteria.where("regdate").gte(start).lt(end));
        // 더 완벽한거
        Query q = new Query(
            Criteria.where("uid").is(uid)
                .andOperator(
                    Criteria.where("regdate").lte(end),
                    Criteria.where("regdate").gte(start)
                )
        );

        return emotionTemplate.find(q, Emotion.class);
    }

    @Override
    public Boolean deleteByDid(String did) {
        Criteria cr = new Criteria("did").is(did);
        Query q = new Query(cr);
        emotionTemplate.remove(q, "emotion");
        return true;
    }

    @Override
    public Boolean deleteByUid(String uid) {
        Criteria cr = new Criteria("uid").is(uid);
        Query q = new Query(cr);
        emotionTemplate.remove(q, "emotion");
        return true;
    }
}
