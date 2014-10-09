package com.weiquan.common;

import java.util.Map;

import org.apache.log4j.Logger;

import com.weiquan.cache.CacheInterface;
import com.weiquan.cache.map.impl.AttrMappingCache;
import com.weiquan.common.system.init.SystemInitJob;
import com.weiquan.common.system.init.impl.SystemCacheInitJob;
import com.weiquan.dao.UserDao;
import com.weiquan.domain.Group;
import com.weiquan.domain.User;
import com.weiquan.service.ServiceCommonInterface;
import com.weiquan.service.attrmapping.AttrMappingCacheInitInterface;

public class WqContext {
	private Logger logger = Logger.getLogger(WqContext.class);
	private Map<String, SystemInitJob> systemJob ; 
	private Map<String, CacheInterface> sysCacheMap ;
	private ServiceCommonInterface<Group> groupService;
	
	public void initSystem() throws Exception {
		logger.info("Wq System starting...");
		logger.info("start init sys cache");
		if(systemJob == null){
			logger.warn("cacheMap is null; There is no map of cache in system!");
		}else{
			
			for(Map.Entry<String, SystemInitJob>  entry: systemJob.entrySet()){
				logger.info("init cache["+entry.getKey()+"] ...");
				entry.getValue().doJob();
				logger.info("init cache["+entry.getKey()+"] success!");
			}
		}
		groupService.getInfoById(412);
		logger.info("init finished");
	}
	
	
	public void initLocalFile(){
		
	}
	
	public void destory(){
		logger.info("Wq System shutdown...");
		
	}



	public Map<String, CacheInterface> getSysCacheMap() {
		return sysCacheMap;
	}


	public void setSysCacheMap(Map<String, CacheInterface> sysCacheMap) {
		this.sysCacheMap = sysCacheMap;
	}


	public void setSystemJob(Map<String, SystemInitJob> systemJob) {
		this.systemJob = systemJob;
	}


	public void setGroupService(ServiceCommonInterface<Group> groupService) {
		this.groupService = groupService;
	}

}
