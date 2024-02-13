package com.savory.savoryAPI.person.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@RequiredArgsConstructor
@SuppressWarnings("unused")
@Entity
@Table (name = "Person")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false)
    private long id;
    @Column(name = "Username", nullable = false)
    private String username;
    @Column(name = "Email", nullable = false)
    private String email;
    @Column(name = "Password", nullable = false)
    private String password;
    @Column (name = "Img", nullable = true)
    private String img;
    @Column (name = "Bio", nullable = true)
    private String bio;
    @Column (name = "Role", nullable = false)
    private boolean isAdmin;

//    @OneToMany
//    @JoinTable(
//            name = "USER_TO_POST",
//            joinColumns = @JoinColumn(name = "USER_ID"),
//            inverseJoinColumns = @JoinColumn(name = "POST_ID"))
//    @ToString.Exclude
//    List<Person> userList;
}
