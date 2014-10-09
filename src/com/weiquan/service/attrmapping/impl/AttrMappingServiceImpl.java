package com.weiquan.service.attrmapping.impl;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.weiquan.domain.QueryParam;
import com.weiquan.domain.SysAttribute;

import org.apache.log4j.Logger;
import com.weiquan.domain.AttrMapping;
import com.weiquan.domain.annotation.AttrAnnotation;
import com.weiquan.dao.AttrMappingDao;
import com.weiquan.dao.SysAttributeDao;
import com.weiquan.service.ServiceCommonInterface;
import com.weiquan.service.attrmapping.AttrMappingCacheInitInterface;
import com.weiquan.util.PackageUtil;
public class AttrMappingServiceImpl implements AttrMappingCacheInitInterface, ServiceCommonInterface<AttrMapping>{
	private Logger logger = Logger.getLogger(AttrMappingServiceImpl.class);
	private AttrMappingDao attrMappingDao;
	private SysAttributeDao sysAttributeDao;
	private String targetPackage = "com.weiquan.domain";

	@Override
	public void initProxyObject(String[] packageUrls, String[] javaUrls,
			String[] outSideJavas) {
		this.targetPackage = packageUrls[0];
	}

	
	@Override
	public Map<String, AttrMapping> initAttrMapping() {
		this.logger.info("begin to init the attrMapping..");
		this.logger.info("iterator the class under the package which be named ["+targetPackage+"]");
		Map<String, AttrMapping> map = new HashMap<String, AttrMapping>();
		AttrMapping temp = new AttrMapping();
		if(targetPackage != null){
			for(Class clazz : PackageUtil.getClasses(targetPackage)){
				this.logger.info("search class ["+clazz.getName()+"]");
				List<Field> fields = getAttrAnnotionFields(clazz);
				this.logger.info("has ["+fields.size()+"] attr fields");
				temp.setJavaName(clazz.getName());
				
				String key;
				for(Field field : fields){
					int model = -1; //备用
					temp.setAttrName(field.getName());
					temp.setModel(model);
					AttrMapping attrMapping = attrMappingDao.getAttrMappingByIndex(temp);
//					key = clazz.getName()+"."+field.getName();
					key = clazz.getSimpleName() +"_"+field.getName();
					if(model != -1){
						key = key + "-" +model;
					}
					if(attrMapping == null){
						logger.warn("["+key+"] 不存在映射Mapping");
					}else{
						this.logger.info("init ["+key+"] Mapping");
						List<SysAttribute>  attrList = sysAttributeDao.querySysAttributeListByGroupId(attrMapping.getGroupId());
						if(attrList == null){
							this.logger.info("There is no SysAttributes for ["+key+"]");
						}
						this.logger.info("init ["+key+"] Mapping cout -- "+attrList.size());
						attrMapping.setAttributes(attrList);
						
						map.put(key, attrMapping);
					}
					
				}
			}
		}
		return map;
		
	}
	
	protected static List<Field> getAttrAnnotionFields(Class clazz){
		List<Field> fields = new ArrayList<Field>();
		for(Field field : clazz.getDeclaredFields()){
			if(field.getAnnotation(AttrAnnotation.class)!=null){
				fields.add(field);
			}
		}
		return fields;
	}
	
	@Override
	public List<AttrMapping> getListByQueryParam(QueryParam queryParam) {
		return null;
	}
	
	@Override
	public AttrMapping getInfoById(long id){
		return null;
	}
	
	@Override
	public AttrMapping getInfoById(AttrMapping arg){
		return this.attrMappingDao.get(arg);
	}
	
	@Override
	public void update(AttrMapping arg){
		this.attrMappingDao.update(arg);
	}
	
	@Override
	public void insert(AttrMapping arg){
		this.attrMappingDao.insert(arg);
	}
	
	public void setAttrMappingDao(AttrMappingDao arg){
		this.attrMappingDao = arg;
	}

	public void setSysAttributeDao(SysAttributeDao sysAttributeDao) {
		this.sysAttributeDao = sysAttributeDao;
	}

	public void setTargetPackage(String targetPackage) {
		this.targetPackage = targetPackage;
	}

	
}