package com.weiquan.service.tag.impl;
import java.util.List;
import org.apache.log4j.Logger;
import com.weiquan.domain.Tag;
import com.weiquan.domain.QueryParam;
import com.weiquan.domain.User;
import com.weiquan.dao.TagDao;
import com.weiquan.service.tag.TagService;
import com.weiquan.service.ServiceCommonInterface;
public class TagServiceImpl implements TagService, ServiceCommonInterface<Tag>{
	private Logger logger = Logger.getLogger(TagServiceImpl.class);
	private TagDao tagDao;

	@Override
	public List<Tag> querySysTagsByUser(User user) {
		return null;
	}
	@Override
	public Tag getInfoById(long id){
		return null;
	}
	@Override
	public Tag getInfoById(Tag arg){
		return this.tagDao.get(arg);
	}
	public List<Tag> getListByQueryParam(QueryParam queryParam){
		return tagDao.getListByQueryParam(queryParam);
	}
	@Override
	public void update(Tag arg){
		this.tagDao.update(arg);
	}
	@Override
	public void insert(Tag arg){
		this.tagDao.insert(arg);
	}
	public void setTagDao(TagDao arg){
		this.tagDao = arg;
	}
}