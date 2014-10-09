package com.weiquan.service.viplevel;

import com.weiquan.common.WqException;
import com.weiquan.domain.ObjectLabelInterface;
import com.weiquan.domain.VipLevel;
public interface VipLevelService {
	/**
	 * 获取会员等级对应模块下的会员权限
	 * @param vipLevel
	 * @param label
	 * @return
	 */
	public int getLevel(VipLevel vipLevel, ObjectLabelInterface label)  throws WqException;
}