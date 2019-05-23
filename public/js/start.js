var res = document.cookie
        .split ( "; " )
            .map ( x =>
                 Object.assign ( {},
                        (
                             arr => {
                                 return { [ arr [0] ] : arr [1] }
                            }
                         ) ( x.split ( "=" ))
                )
             ).find(user => {
                 return user.email
                })
res ? document.body.appendChild(document.createElement('todo-list')) : 
                                document.body.appendChild(document.createElement('auth-element')) 
