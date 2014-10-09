package com.weiquan.dao;
import java.util.List;

import com.weiquan.domain.Sheet;
public interface SheetDao  extends WqAbstractDao<Sheet>{
	public List<Sheet> querySheetsByTagId(long tagId);
} 