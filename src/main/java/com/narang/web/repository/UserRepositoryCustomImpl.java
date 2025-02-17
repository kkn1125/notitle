package com.narang.web.repository;

import com.narang.web.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


public class UserRepositoryCustomImpl implements UserRepositoryCustom {
    MongoTemplate userTemplate;

    @Autowired
    UserRepositoryCustomImpl (MongoTemplate userTemplate){
        this.userTemplate = userTemplate;
    }

    @Override
    public Optional<User> findByNickName(String nickName) {
        Criteria cr = new Criteria("nickName");
        cr.is(nickName);
        Query q = new Query(cr);
        return Optional.ofNullable(userTemplate.findOne(q, User.class));
    }

    @Override
    public List<User> findByNickNames(List<String> nickNames) {
        Criteria orCriteria = new Criteria();
        List<Criteria> orExp = new ArrayList<>();

        Query q = new Query();

        nickNames.forEach(name -> {
            Criteria exp = new Criteria();
            exp.and("nickName").is(name);
            orExp.add(exp);
        });

        q.addCriteria(orCriteria.orOperator(orExp.toArray(new Criteria[orExp.size()])));
        System.out.println(q);
        return userTemplate.find(q, User.class);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        Criteria cr = new Criteria("email");
        cr.is(email);
        Query q = new Query(cr);

        return Optional.of(userTemplate.findOne(q, User.class));
    }

    public User update(User user) {
        User foundUser = userTemplate.findById(user.getId(), User.class);
        foundUser.replaceIfNotNull(user);
        return userTemplate.save(foundUser, "user");
    }

    @Override
    public User removeProfileImageById(String id) {
        User foundedUser = userTemplate.findById(id, User.class);
        foundedUser.setProfileImg("");
        return userTemplate.save(foundedUser, "user");
    }
}
