package com.weiquan.service.tag;
import java.util.List;
import com.weiquan.domain.Tag;
import com.weiquan.domain.User;
public interface TagService {
	
	public List<Tag> querySysTagsByUser(User user);
}