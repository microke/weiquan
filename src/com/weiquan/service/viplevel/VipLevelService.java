package com.weiquan.service.viplevel;

import com.weiquan.common.WqException;
import com.weiquan.domain.ObjectLabelInterface;
import com.weiquan.domain.VipLevel;
public interface VipLevelService {
	/**
	 * ��ȡ��Ա�ȼ���Ӧģ���µĻ�ԱȨ��
	 * @param vipLevel
	 * @param label
	 * @return
	 */
	public int getLevel(VipLevel vipLevel, ObjectLabelInterface label)  throws WqException;
}