# 启动项目

```
1.
    拉取项目
```

```
git clone git@github.com:noviceusr/baseTemplate-admin-nestjs.git
```

```
2.
    建立一个 名为 vue_admin_template 的mysql数据库
 
3.
    在.env文件中配置好账号密码  root:123456 账号:密码
    
4.
    安装依赖
    pnpm i
    
5.
    迁移数据库
    npx prisma migrate dev
    
6. 
    运行项目
    pnpm run start:dev
```

```
7. 
    swagger来测试接口
    访问 http://localhost:3000/admin-api

8.
    apipost来测试接口
    将apipost目录里面的json文件导入到apipost软件中
```


# 权限说明

```
角色分类(role)
    有多少个角色,每个角色一个id

角色管理(role_child)
    除了id没有唯一值,每一条记录包含 某个角色 和 某个账号,说名该账号有该角色
    role_id user_id : 角色id 账号id
    (role_id跟user_id不能同时重复)
    例如:
        为 id为(1) 的 admin账号 添加一个 id为(3) 的管理员gly角色 ,那么就会多出这样一条记录
        role_id user_id
          3         1
        这样一条记录
    怎么查看用户id为1的账号,有哪些角色?
        表中 user_id=1 的所有记录就是他拥有的角色

菜单分类(menu)
    有多少个菜单,每个菜单一个id

菜单管理(menu_child)
    跟角色管理一样,字段为
    role_id  menu_id
    怎么查看 角色id为3的所有菜单?
        menu_child表中 role_id=3 的所有记录
```

# 接口说明

```
将apipost目录导入到apipost软件里,每个接口的说明都写在了接口说明上面

没有写的看名称的命名,大概意思,因为写说明难打字
```
