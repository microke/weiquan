package test.autoCode;

import java.util.HashMap;
import java.util.Map;

import test.util.sqlGenerator.AutomaticSqlCodeGenerator;

import com.weiquan.domain.User;


public class UserSqlCreater {
		public static void main(String[] args) {
			String  xmlFileDirctory = "";
			
			
			
			Class clazz = User.class; 
			String tableName = "weiquan_"+clazz.getSimpleName();
			String colmunName = clazz.getSimpleName()+"AllColsAllCols";
			
			
			try {
				Map<String, String> map = new HashMap<String, String>();
				map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
				System.out.println(AutomaticSqlCodeGenerator.getCreateTableCode(clazz, null, map));
				
				System.out.println("-----------------------------------");
				System.out.println(AutomaticSqlCodeGenerator.getIbatisResultMap(clazz));
				
//				System.out.println("-----------------------------------");
				System.out.println();
				map.clear();
				//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_SIMPLENAME,"x");
				//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"xfundsBatchHisAllCols");
				System.out.println(AutomaticSqlCodeGenerator.getIbatisFieldSql(clazz,map));
				
//				System.out.println("-----------------------------------------");
				System.out.println();
				map.clear();
				//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"insert");
				map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
				map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLECOLUME_NAME,colmunName);
				System.out.println(AutomaticSqlCodeGenerator.insertFieldSql(clazz,map));
				
				
//				System.out.println("-----------------------------------------");
				System.out.println();
				map.clear();
				//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"update");
				map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
				map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_PRIMARY_NAME,"userId");
				System.out.println(AutomaticSqlCodeGenerator.updateFieldSql(clazz,map));
				
//				System.out.println("-----------------------------------------");
				System.out.println();
				map.clear();
				//map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_ID,"update");
//				map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_SIMPLENAME,"t");
				map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLE_NAME,tableName);
				map.put(AutomaticSqlCodeGenerator.MAP_KEY_SQL_TABLECOLUME_NAME,"UserAllColsAllCols");
				System.out.println(AutomaticSqlCodeGenerator.selectSql(clazz,map));
			} catch (Exception e) {
				e.printStackTrace();
			}
	}
}
