drop table weiquan_group_image;
create table weiquan_group_image(
	imageId int NOT NULL AUTO_INCREMENT,
	directory varchar(200),
	fileName varchar(100),
	industryId int,
	imageSource varchar(200),
	relationNo int NOT NULL,
	imageType int,
	primary key(imageId)
);

drop table weiquan_goods_image;
create table weiquan_goods_image(
	imageId int NOT NULL AUTO_INCREMENT,
	directory varchar(200),
	fileName varchar(100),
	industryId int,
	imageSource varchar(200),
	relationNo int NOT NULL,
	imageType int,
	primary key(imageId)
);

drop table weiquan_bussiness_image;
create table weiquan_bussiness_image(
	imageId int NOT NULL AUTO_INCREMENT,
	directory varchar(200),
	fileName varchar(100),
	industryId int,
	imageSource varchar(200),
	relationNo int NOT NULL,
	imageType int,
	primary key(imageId)
);

drop table WEIQUAN_ADVERTISEMENT_image;
create table WEIQUAN_ADVERTISEMENT_image(
	imageId int NOT NULL AUTO_INCREMENT,
	directory varchar(200),
	fileName varchar(100),
	industryId int,
	imageSource varchar(200),
	relationNo int NOT NULL,
	imageType int,
	primary key(imageId)
);


drop table WEIQUAN_NEWINFO_image;
create table WEIQUAN_NEWINFO_image(
	imageId int NOT NULL AUTO_INCREMENT,
	directory varchar(200),
	fileName varchar(100),
	industryId int,
	imageSource varchar(200),
	relationNo int NOT NULL,
	imageType int,
	primary key(imageId)
);