package com.weiquan.service.viplevel.impl;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.weiquan.common.WqException;
import com.weiquan.domain.ObjectLabelInterface;
import com.weiquan.domain.VipLevel;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.VipLevelDao;
import com.weiquan.service.viplevel.VipLevelService;
import com.weiquan.service.ServiceCommonInterface;
public class VipLevelServiceImpl implements VipLevelService, ServiceCommonInterface<VipLevel>{
	private Logger logger = Logger.getLogger(VipLevelServiceImpl.class);
	private Map<String, Integer> powerSiteMap ;
	private VipLevelDao vipLevelDao;

	@Override
	public int getLevel(VipLevel vipLevel, ObjectLabelInterface label)  throws WqException{
		WqException.argNullCheck(vipLevel, label);//参数验证
		Integer powerSite = powerSiteMap.get(label.getTableName());
		if(powerSite == null){
			throw new WqException("ERROR.VIPLEVEL.POWERSITENOTEXSIT");
		}
		return 0;
	}
	@Override
	public VipLevel getInfoById(long id){
		return null;
	}
	@Override
	public VipLevel getInfoById(VipLevel arg){
		return this.vipLevelDao.get(arg);
	}
	public List<VipLevel> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(VipLevel arg){
		this.vipLevelDao.update(arg);
	}
	@Override
	public void insert(VipLevel arg){
		this.vipLevelDao.insert(arg);
	}
	public void setVipLevelDao(VipLevelDao arg){
		this.vipLevelDao = arg;
	}
}