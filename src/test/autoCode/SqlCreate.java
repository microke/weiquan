package test.autoCode;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.QueryParam;

import org.apache.log4j.Logger;

import test.util.sqlGenerator.AutomaticSqlCodeGenerator;

import com.weiquan.dao.ImageDao;
import com.weiquan.dao.RoleDao;
import com.weiquan.domain.Advertisement;
import com.weiquan.domain.AttrMapping;
import com.weiquan.domain.Bussiness;
import com.weiquan.domain.Element;
import com.weiquan.domain.Goods;
import com.weiquan.domain.Image;
import com.weiquan.domain.Industry;
import com.weiquan.domain.NewInfo;
import com.weiquan.domain.Role;
import com.weiquan.domain.Sheet;
import com.weiquan.domain.SysAttribute;
import com.weiquan.domain.TableTemplet;
import com.weiquan.domain.Tag;
import com.weiquan.domain.VipLevel;
import com.weiquan.service.image.ImageService;
import com.weiquan.service.image.impl.ImageServiceImpl;

import frameWork.util.StrUtil;

public class SqlCreate {
	private static Logger logger = Logger.getLogger(SqlCreate.class);
	public static final String FORMAT_FLAG = "	";
	public static void main(String[] args){
		String xmlFileDirctory = "E:\\workspace\\workspace_BEA_XFUNDS\\WMZ_WEIQUAN_A\\src\\config\\mybatis\\";
		String daoFileDirctory = "E:\\workspace\\workspace_BEA_XFUNDS\\WMZ_WEIQUAN_A\\src\\com\\weiquan\\dao\\";
		String serviceFileDirctory = "E:\\workspace\\workspace_BEA_XFUNDS\\WMZ_WEIQUAN_A\\src\\com\\weiquan\\service\\";
		Object[][] classList = {
//				{Element.class, "id"},
//				{Industry.class, "industryId"},
//				{Image.class, "imageId"},
//				{NewInfo.class, "newId"},
//				{Role.class, "roleId"},
//				{Sheet.class, "sheetId"},
				{Bussiness.class, "bussinessId"},
//				{Advertisement.class, "adId"},
//				{TableTemplet.class, "templetId"},
//				{Goods.class, "goodsId"},
//				{VipLevel.class, "vipId"},
//				{SysAttribute.class, "attrId"},
//				{AttrMapping.class, "serilno"},
//				{Tag.class, "tagId"},
//				
		};
		
		StringBuffer springBfr = new StringBuffer();
		StringBuffer springServiceBfr = new StringBuffer();
		
		for(Object[] config : classList){
			
			Class clazz = (Class)config[0]; 
			String tableName = "weiquan_"+clazz.getSimpleName();
			
			String key = (String)config[1];
			StringBuffer sbf1 = new StringBuffer();
			boolean isCreate = true;
			try {
				
				springBfr.append(AutomaticSqlCodeGenerator.FORMAT_FLAG).append("<bean id=\""+clazz.getSimpleName()+"Dao\" class=\"org.mybatis.spring.mapper.MapperFactoryBean\" >").append(StrUtil.LINE);
				springBfr.append(AutomaticSqlCodeGenerator.FORMAT_FLAG).append(AutomaticSqlCodeGenerator.FORMAT_FLAG).append("<property name=\"mapperInterface\" value=\"com.weiquan.dao."+clazz.getSimpleName()+"Dao\"></property>").append(StrUtil.LINE);
				springBfr.append(AutomaticSqlCodeGenerator.FORMAT_FLAG).append(AutomaticSqlCodeGenerator.FORMAT_FLAG).append("<property name=\"sqlSessionFactory\" ref=\"sqlSessionFactory\"></property>").append(StrUtil.LINE);
				springBfr.append(AutomaticSqlCodeGenerator.FORMAT_FLAG).append("</bean>").append(StrUtil.LINE);
				springServiceBfr.append("<bean id=\""+StrUtil.toFirstLowerCase(clazz.getSimpleName())+"Service\" class=\"com.weiquan.service."+clazz.getSimpleName().toLowerCase()+".impl."+clazz.getSimpleName()+"ServiceImpl\" />").append(StrUtil.LINE);
//	
				createDao(daoFileDirctory, clazz, isCreate);
				
				Map<String, String> map = createTableSql(clazz, tableName, key,	sbf1);
				createXmlFile(map, clazz, tableName, key, xmlFileDirctory, isCreate);
				createServiceInterface(serviceFileDirctory+clazz.getSimpleName().toLowerCase()+"\\", clazz, isCreate);
				createServiceImplInterface(serviceFileDirctory +clazz.getSimpleName().toLowerCase()+"\\impl\\", clazz, isCreate);
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			System.out.println(sbf1.toString());
			System.out.println("-----------------------------------------------");
			System.out.println(springBfr.toString());
			System.out.println(springServiceBfr.toString());
		}
	}
	
	private static void  createXmlFile(Map<String, String> map, Class clazz, String tableName, String key, String xmlFileDirctory, boolean isCreateFile) throws Exception{
		String colomunAll = clazz.getSimpleName()+"AllCols";
		StringBuffer sbf = new StringBuffer();
		
		sbf.append("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>").append(StrUtil.LINE);
		sbf.append("<!DOCTYPE mapper PUBLIC ").append(StrUtil.LINE);
		sbf.append("    \"-//mybatis.org//DTD Mapper 3.0//EN\"").append(StrUtil.LINE);
		sbf.append("    \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">").append(StrUtil.LINE);
		sbf.append("<mapper namespace=\"com.weiquan.dao."+clazz.getSimpleName()+"Dao\">").append(StrUtil.LINE);
		
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
		sbf.append(AutomaticSqlCodeGenerator.getIbatisResultMap(clazz));
			
//		System.out.println("-----------------------------------");
		sbf.append(StrUtil.LINE);
		map.clear();
		//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_SIMPLENAME,"x");
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,clazz+"AllCols");
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
		sbf.append(AutomaticSqlCodeGenerator.getIbatisFieldSql(clazz,map)).append(StrUtil.LINE);
		
//		System.out.println("-----------------------------------------");
		sbf.append(StrUtil.LINE);
		map.clear();
		//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"insert");
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLECOLUME_NAME,colomunAll);
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
		sbf.append(AutomaticSqlCodeGenerator.insertFieldSql(clazz,map)).append(StrUtil.LINE);
		
		
//		sbf.append("-----------------------------------------");
		sbf.append(StrUtil.LINE);
		map.clear();
		//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"update");
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
		sbf.append(AutomaticSqlCodeGenerator.updateFieldSql(clazz,map));
		
//		sbf.append("-----------------------------------------");
		sbf.append(StrUtil.LINE);
		map.clear();
		//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"update");
//		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_SIMPLENAME,"t");
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"get");
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLECOLUME_NAME,colomunAll);
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
		sbf.append(AutomaticSqlCodeGenerator.selectSql(clazz,map)).append(StrUtil.LINE);
		sbf.append("</mapper>").append(StrUtil.LINE);
		logger.info(sbf.toString());
//		System.out.println(sbf.toString());
		if(isCreateFile){
			File file = new File(xmlFileDirctory+clazz.getSimpleName()+".xml");
			if(!file.exists()){
				file.createNewFile();
			}
			FileOutputStream out = new FileOutputStream(file);
			try{
				out.write(sbf.toString().getBytes("UTF-8"));
			}finally{
				if(out != null){
					out.close();
				}
			}
		}
	}
	
	private static Map<String, String> createTableSql(Class clazz,
			String tableName, String key, StringBuffer sbf1) throws Exception {
		Map<String, String> map = new HashMap<String, String>();
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
		map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
		sbf1.append(AutomaticSqlCodeGenerator.getCreateTableCode(clazz, null, map)).append(StrUtil.LINE);
		return map;
	}
	
	
	private static void createServiceInterface(String serviceFileDirctory, Class clazz, boolean isCreateFile)
			throws IOException, FileNotFoundException,
			UnsupportedEncodingException {
		StringBuffer sbfDao = new StringBuffer();
		sbfDao.append("package com.weiquan.service."+clazz.getSimpleName().toLowerCase()+";").append(StrUtil.LINE);
		
		sbfDao.append("import java.util.List;").append(StrUtil.LINE);
		
		sbfDao.append("import com.weiquan.domain."+clazz.getSimpleName()+";").append(StrUtil.LINE);

		sbfDao.append("public interface "+clazz.getSimpleName()+"Service {").append(StrUtil.LINE);
		
		
		sbfDao.append("}");
		logger.info(sbfDao.toString());
		
		if(isCreateFile){
			createFile(serviceFileDirctory , clazz.getSimpleName()+"Service.java", sbfDao);
		}
	}
	
	private static void createServiceImplInterface(String serviceimplFileDirctory, Class clazz, boolean isCreateFile)
			throws IOException, FileNotFoundException,
			UnsupportedEncodingException {
		String daoName = StrUtil.toFirstLowerCase(clazz.getSimpleName())+"Dao";
		StringBuffer sbfDao = new StringBuffer();
		sbfDao.append("package com.weiquan.service."+clazz.getSimpleName().toLowerCase()+".impl;").append(StrUtil.LINE);
		
		sbfDao.append("import java.util.List;").append(StrUtil.LINE);
		sbfDao.append("import org.apache.log4j.Logger;").append(StrUtil.LINE);
		
		sbfDao.append("import com.weiquan.domain."+clazz.getSimpleName()+";").append(StrUtil.LINE);
		sbfDao.append("import com.weiquan.domain.QueryParam;").append(StrUtil.LINE);
		sbfDao.append("import com.weiquan.dao."+clazz.getSimpleName()+"Dao;").append(StrUtil.LINE);
		sbfDao.append("import com.weiquan.service."+clazz.getSimpleName().toLowerCase()+"."+clazz.getSimpleName()+"Service;").append(StrUtil.LINE);
		sbfDao.append("import com.weiquan.service.ServiceCommonInterface;").append(StrUtil.LINE);

		sbfDao.append("public class "+clazz.getSimpleName()+"ServiceImpl implements "+clazz.getSimpleName()+"Service, ServiceCommonInterface<"+clazz.getSimpleName()+">{").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("private Logger logger = Logger.getLogger("+clazz.getSimpleName()+"ServiceImpl.class);").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("private "+clazz.getSimpleName()+"Dao "+daoName+";").append(StrUtil.LINE);
		sbfDao.append(StrUtil.LINE);
		
		sbfDao.append(FORMAT_FLAG).append("@Override").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("public "+clazz.getSimpleName()+" getInfoById(long id){").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append(FORMAT_FLAG).append("return null;").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("}").append(StrUtil.LINE);
		
		sbfDao.append(FORMAT_FLAG).append("@Override").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("public "+clazz.getSimpleName()+" getInfoById("+clazz.getSimpleName()+" arg){").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append(FORMAT_FLAG).append("return this."+daoName+".get(arg);").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("}").append(StrUtil.LINE);

	/*	sbfDao.append(FORMAT_FLAG).append("public List<"+clazz.getSimpleName()+"> get"+clazz.getSimpleName()+"ListByIds(long[] ids){").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append(FORMAT_FLAG).append("return null;").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("}").append(StrUtil.LINE);

		sbfDao.append(FORMAT_FLAG).append("public List<"+clazz.getSimpleName()+"> get"+clazz.getSimpleName()+"ListByIds(List<Long> ids){").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append(FORMAT_FLAG).append("return null;").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("}").append(StrUtil.LINE);
		*/
		sbfDao.append(FORMAT_FLAG).append("public List<"+clazz.getSimpleName()+"> getListByQueryParam(QueryParam queryParam){").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append(FORMAT_FLAG).append("return null;").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("}").append(StrUtil.LINE);

		sbfDao.append(FORMAT_FLAG).append("@Override").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("public void update("+clazz.getSimpleName()+" arg){").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append(FORMAT_FLAG).append("this."+daoName+".update(arg);").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("}").append(StrUtil.LINE);
		
		sbfDao.append(FORMAT_FLAG).append("@Override").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("public void insert("+clazz.getSimpleName()+" arg){").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append(FORMAT_FLAG).append("this."+daoName+".insert(arg);").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("}").append(StrUtil.LINE);
		
		sbfDao.append(FORMAT_FLAG).append("public void set"+clazz.getSimpleName()+"Dao("+clazz.getSimpleName()+"Dao arg){").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append(FORMAT_FLAG).append("this."+daoName+" = arg;").append(StrUtil.LINE);
		sbfDao.append(FORMAT_FLAG).append("}").append(StrUtil.LINE);
		
		sbfDao.append("}");
		logger.info(sbfDao.toString());
		
		if(isCreateFile){
			createFile(serviceimplFileDirctory , clazz.getSimpleName()+"ServiceImpl.java", sbfDao);
		}
	}
	
	private static void createDao(String daoFileDirctory, Class clazz, boolean isCreateFile)
			throws IOException, FileNotFoundException,
			UnsupportedEncodingException {
		StringBuffer sbfDao = new StringBuffer();
		sbfDao.append("package com.weiquan.dao;").append(StrUtil.LINE);

		sbfDao.append("import com.weiquan.domain."+clazz.getSimpleName()+";").append(StrUtil.LINE);

		sbfDao.append("public interface "+clazz.getSimpleName()+"Dao  extends WqAbstractDao<"+clazz.getSimpleName()+">{").append(StrUtil.LINE);
			
		sbfDao.append("}");
		logger.info(sbfDao.toString());
		
		if(isCreateFile){
			createFile(daoFileDirctory , clazz.getSimpleName()+"Dao.java", sbfDao);
		}
	}
	
	public static void createFile(String fileDirctoryP, String fileName, StringBuffer sbfDao) throws IOException  {
		System.out.println(fileDirctoryP);
		System.out.println(fileName);
		File fileDirctory = new File(fileDirctoryP);
		if(!fileDirctory.exists()){
			fileDirctory.mkdirs();
		}
		
		File daofile = new File(fileDirctoryP +fileName);
		if(!daofile.exists()){
			daofile.createNewFile();
		}
		FileOutputStream daoOut = new FileOutputStream(daofile);
		try{
			daoOut.write(sbfDao.toString().getBytes("GBK"));
		}finally{
			if(daoOut != null){
				daoOut.close();
			}
		}
	}


}



