drop table weiquan_user;
create table weiquan_user   
(
    userid        int NOT NULL AUTO_INCREMENT COMMENT '用户编号',
    name        varchar(200)  COMMENT '用户名称',
	vipId		int				COMMENT '用户等级',
    password          varchar(40) COMMENT '密码  ',
    enabled        int  COMMENT '启用状态',
    roleid        int  COMMENT '角色',
    validdate          int    COMMENT '有效期限',
	validCount	int DEFAULT  0 COMMENT '密码输入错误次数',
    type        int  COMMENT '类型 暂时不用',
    account        varchar(500)  COMMENT '微信账号 ',
    telephone          varchar(20)  COMMENT '电话 暂时不用',
    email        varchar(20)  COMMENT '邮箱 暂时不用',
    address        varchar(40)  COMMENT '地址 暂时不用',
    certtype          int  COMMENT '证件类型 暂时不用',
    certnumber          varchar(20)  COMMENT '证件号码 暂时不用',
    memo        varchar(100) COMMENT '备注 暂时不用',

primary key(userid)
);

drop table weiquan_group;
create  table weiquan_group
(
	groupId int NOT NULL AUTO_INCREMENT COMMENT '编号',
	sourceId int COMMENT '群来源',
	industryId int COMMENT '行业类型',
	userId int COMMENT '创建用户编号',
	groupName varchar(100) COMMENT '群名称',
	groupSimpleName varchar(100) COMMENT '简介',
	memo varchar(255) COMMENT '详解',
	groupUrl int COMMENT '',
	groupShowImage int COMMENT '',
	primary key(groupId)
);

drop table weiquan_role;
create table weiquan_role(
	roleId int NOT NULL AUTO_INCREMENT,
	roleName varchar(100),
	rolePower int,
	primary key(roleId)
);


drop table weiquan_Element;
create table weiquan_Element(
	id int NOT NULL AUTO_INCREMENT,
	sourceType int,
	imageUrl varchar(200),
	name varchar(100),
	simpleIntroduce varchar(300),
	primary key(id)
);

drop table weiquan_GroupType;
create table weiquan_GroupType(
	typeId int NOT NULL AUTO_INCREMENT,
	name varchar(100),
	memo varchar(500),
	url varchar(400),
	primary key(typeId)
);

drop table weiquan_NewInfo;
create table weiquan_NewInfo(
	newId int NOT NULL AUTO_INCREMENT,
	newUrl int,
	title varchar(100),
	newSimpleIntroduce varchar(500),
	memo varchar(500),
	sourceId int,
	creatDate int,
	creatTime int,
	channel varchar(100),
	primary key(newId)
);

drop table weiquan_Role;
create table weiquan_Role(
	roleId int NOT NULL AUTO_INCREMENT,
	roleName varchar(200),
	rolePower int,
	primary key(roleId)
);

drop table weiquan_Sheet;
create table weiquan_Sheet(
	sheetId int NOT NULL AUTO_INCREMENT,
	sheetType int,
	tagId int,
	sheetName varchar(200),
	sheetIntroduce varchar(200),
	sheetIndex int NULL DEFAULT 0,
	recommendUrl varchar(200),
	recommendName varchar(200),
	moreUrl varchar(200),
	templetId int,
	sourceName varchar(255),
	primary key(sheetId)
);

drop table weiquan_VipLevel;
create table weiquan_VipLevel(
	vipId int NOT NULL AUTO_INCREMENT,
	vipName varchar(100),
	vipPower varchar(200),
	rateOfMonth double,
	rateOfTreeMonth double,
	rateOfHarfYear double,
	rateOfYear double,
	rateOfForever double,
	memo varchar(500),
	primary key(vipId)
);


drop table weiquan_Industry;
create table weiquan_Industry(
	industryId int NOT NULL AUTO_INCREMENT,
	name varchar(200),
	memo varchar(1000),
	logoImage int,
	primary key(industryId)
);


drop table weiquan_AttrMapping;
create table weiquan_AttrMapping(
	serilno int NOT NULL AUTO_INCREMENT,
	javaName varchar(200),
	attrName varchar(200),
	groupId int,
	level int,
	model int  NOT NULL  DEFAULT -1 ,
	primary key(serilno)
);
ALTER TABLE weiquan_attrmapping ADD UNIQUE INDEX INDEX_ATTRMAPPING_1 (javaName, attrName, model) ;

drop table weiquan_SysAttribute;
create table weiquan_SysAttribute(
	attrId int NOT NULL AUTO_INCREMENT,
	groupId NOT NULL AUTO_INCREMENT,
	attrName varchar(200),
	attrValue varchar(200),
	language int,
	indexNo int,
	attrValueType int,
	level int,
	primary key(attrId)
);

drop table weiquan_Tag;
create table weiquan_Tag(
	tagId int NOT NULL AUTO_INCREMENT,
	tagName varchar(200),
	tagType varchar(200),
	tagUrl varchar(200),
	orderNo int,
	level int,
	primary key(tagId)
);


drop table weiquan_Goods;
CREATE TABLE `weiquan_Goods` (
	`goodsId`  int(11) NOT NULL AUTO_INCREMENT ,
	`goodsName`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`industryId`  int(11) NULL DEFAULT NULL ,
	`goodResume`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`bussInfo`  varchar(2000) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`infomation`  varchar(2000) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`contactQQ`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`contactWX`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`contactBU`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`contactPhone`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`contactMobile`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`contactAddress`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	`contactUser`  varchar(200) CHARACTER SET gbk COLLATE gbk_chinese_ci NULL DEFAULT NULL ,
	PRIMARY KEY (`goodsId`)
);

drop table weiquan_TableTemplet;
create table weiquan_TableTemplet(
	templetId int NOT NULL AUTO_INCREMENT,
	templetName varchar(200),
	page int,
	size int,
	columnCount int,
	pageType int,
	primary key(templetId)
);

drop table weiquan_Advertisement;
create table weiquan_Advertisement(
	adId int NOT NULL AUTO_INCREMENT,
	adName varchar(200),
	createDate int,
	beginDate int,
	endDate int,
	adType int,
	sheetId int,
	channelName varchar(200),
	memo varchar(500),
	primary key(adId)
);

drop table weiquan_Bussiness;
create table weiquan_Bussiness(
	bussinessId int NOT NULL AUTO_INCREMENT,
	name varchar(200),
	createTime int,
	memo varchar(200),
	industryId int,
	primary key(bussinessId)
);