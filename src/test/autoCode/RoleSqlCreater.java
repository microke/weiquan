package test.autoCode;

import java.util.HashMap;
import java.util.Map;

import test.util.sqlGenerator.AutomaticSqlCodeGenerator;

import com.weiquan.domain.Group;
import com.weiquan.domain.Role;

public class RoleSqlCreater {
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String tableName = "weiquan_role";
		Class clazz = Role.class; 
		String key = "roleId";
		String colomunAll = "RoleAllColsAllCols";
		try {
			Map<String, String> map = new HashMap<String, String>();
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
			System.out.println(AutomaticSqlCodeGenerator.getCreateTableCode(clazz, null, map));
			
			System.out.println("-----------------------------------");
			
			System.out.println("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
			System.out.println("<!DOCTYPE mapper PUBLIC ");
			System.out.println("    \"-//mybatis.org//DTD Mapper 3.0//EN\"");
			System.out.println("    \"http://mybatis.org/dtd/mybatis-3-mapper.dtd\">");
			System.out.println("<mapper namespace=\"com.weiquan.dao."+clazz.getSimpleName()+"Dao\">");
			
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
			System.out.println(AutomaticSqlCodeGenerator.getIbatisResultMap(clazz));
			
//			System.out.println("-----------------------------------");
			System.out.println();
			map.clear();
			//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_SIMPLENAME,"x");
			//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"xfundsBatchHisAllCols");
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
			System.out.println(AutomaticSqlCodeGenerator.getIbatisFieldSql(clazz,map));
			
//			System.out.println("-----------------------------------------");
			System.out.println();
			map.clear();
			//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"insert");
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLECOLUME_NAME,colomunAll);
			System.out.println(AutomaticSqlCodeGenerator.insertFieldSql(clazz,map));
			
			
//			System.out.println("-----------------------------------------");
			System.out.println();
			map.clear();
			//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"update");
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
			System.out.println(AutomaticSqlCodeGenerator.updateFieldSql(clazz,map));
			
//			System.out.println("-----------------------------------------");
			System.out.println();
			map.clear();
			//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"update");
//			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_SIMPLENAME,"t");
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"get");
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLECOLUME_NAME,colomunAll);
			map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,key);
			System.out.println(AutomaticSqlCodeGenerator.selectSql(clazz,map));
			System.out.println("</mapper>");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
