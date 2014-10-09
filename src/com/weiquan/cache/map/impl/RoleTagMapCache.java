package com.weiquan.cache.map.impl;

import java.util.LinkedHashMap;
import java.util.List;

import org.apache.log4j.Logger;

import com.weiquan.cache.map.AbstractMapCache;
import com.weiquan.domain.QueryParam;
import com.weiquan.domain.Tag;
import com.weiquan.service.ServiceCommonInterface;

public class RoleTagMapCache extends AbstractMapCache<Tag>{
	private Logger logger = Logger.getLogger(RoleTagMapCache.class);
	private ServiceCommonInterface<Tag> tagService;

	@Override
	public void initCache() throws Exception {
		logger.info("begin init RoleTag Map...");
		List<Tag> tags = this.tagService.getListByQueryParam(new QueryParam());
		super.data = new LinkedHashMap<String, Tag>(); 
		for(Tag tag  : tags){
			logger.info("add RoleTag Map[tagId: "+tag.getTagId()+", tagName: "+tag.getTagName()+"]...");
			super.data.put(String.valueOf(tag.getTagId()), tag);
		}
		logger.info("finished init RoleTag Map...");
	}
	
	
	public void setTagService(ServiceCommonInterface<Tag> tagService) {
		this.tagService = tagService;
	}

}
